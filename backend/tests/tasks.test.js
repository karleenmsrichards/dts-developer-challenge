const request = require('supertest');
const { app, tasks } = require('../app');

describe('Basic API test', () => {
  it('should respond with server running message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Backend server is running!');
  });
});

describe('GET /tasks', () => {
  beforeEach(() => {
    tasks.length = 0; // ensure clean state
  });

  it('should return no tasks when tasks array is empty', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'No tasks found', tasks: [] });
  });

  it('should return the tasks array when tasks exist', async () => {
    const taskData = { title: 'Test task', dueDate: '2025-12-31' };
    const postRes = await request(app).post('/tasks').send(taskData);
    expect(postRes.statusCode).toBe(201);

    const getRes = await request(app).get('/tasks');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toEqual([postRes.body]);
  });
});

describe('POST /tasks', () => {
  beforeEach(() => {
    tasks.length = 0; // clean slate for POST tests
  });

  it('should create a task', async () => {
    const taskData = { title: 'Test task', dueDate: '2025-12-31' };
    const res = await request(app).post('/tasks').send(taskData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({
      title: 'Test task',
      dueDate: '2025-12-31',
      completed: false
    });
    expect(res.body).toHaveProperty('id');
  });

  it('should return 400 if title is missing', async () => {
    const res = await request(app).post('/tasks').send({ dueDate: '2025-12-31' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Title is required' });
  });

  it('should return 400 if title is empty', async () => {
    const res = await request(app).post('/tasks').send({ title: '   ', dueDate: '2025-12-31' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Title is required' });
  });

  it('should return 400 if dueDate is missing', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Test task' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid due date' });
  });

  it('should return 400 if dueDate is invalid', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Test task', dueDate: 'invalid-date' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid due date' });
  });
});

describe('PUT /tasks/:id', () => {
  let taskId;

  beforeEach(async () => {
    tasks.length = 0; // ensure isolation
    const postRes = await request(app)
      .post('/tasks')
      .send({ title: 'Task to update', dueDate: '2025-12-30' });
    taskId = postRes.body.id;
  });

  it('should update a task by id', async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .send({ dueDate: '2025-12-31' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      title: 'Task to update',
      dueDate: '2025-12-31',
      completed: false
    });
    expect(res.body).toHaveProperty('id', taskId);
  });

  it('should return 404 for a non-existent task', async () => {
    const res = await request(app)
      .put('/tasks/9999')
      .send({ title: 'New Title' });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Task not found' });
  });
});

describe('DELETE /tasks/:id', () => {
  let taskId;

  beforeEach(async () => {
    tasks.length = 0; // clean before delete tests
    const postRes = await request(app)
      .post('/tasks')
      .send({ title: 'Task to delete', dueDate: '2025-12-31' });
    taskId = postRes.body.id;
  });

  it('should delete a task by id', async () => {
    const res = await request(app).delete(`/tasks/${taskId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Task deleted successfully');
    expect(res.body.task).toHaveProperty('id', taskId);
  });

  it('should return 404 for a non-existent task', async () => {
    const res = await request(app).delete('/tasks/9999');

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Task not found' });
  });
});