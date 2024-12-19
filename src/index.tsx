import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { jsx } from 'hono/jsx'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { renderForm, Form } from './renderer'

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

const BASE_URL = 'http://example.com'

const formSchema = z.object({
  name: z.string().min(1, "name is required"),
  hometown: z.string().min(1, "hometown is required"),
})

app.post('/create-form', async (c) => {
  const uniqueId = nanoid()
  
  await c.env.DB.prepare(
    'INSERT INTO forms (id) VALUES (?)'
  ).bind(uniqueId).run()
  
  return c.json({ 
    formUrl: `${BASE_URL}/form/${uniqueId}` 
  })
})

app.post('/form/:id', async (c) => {
  const formId: string = c.req.param('id')
  const requestData = await c.req.parseBody()

  const form = await c.env.DB.prepare(
    'SELECT id FROM forms WHERE id = ?'
  ).bind(formId).first()
  if (!form) {
    return c.html(<p>not found</p>)
  }
  const savedName = requestData.name || form.name
  const savedHometown = requestData.hometown || form.hometown
  
  await c.env.DB.prepare(
    'UPDATE forms SET name = ?, hometown = ? WHERE id = ?'
  ).bind(savedName, savedHometown, formId).run()

  return c.html(
    <Form
      formId={formId}
      name={requestData?.name}
      hometown={requestData?.hometown}
      message="success!"
    />
  )
})

app.get('/form/:id', async (c) => {
  const formId: string = c.req.param('id')

  const form = await c.env.DB.prepare(
    'SELECT id, name, hometown FROM forms WHERE id = ?'
  ).bind(formId).first()
  if (!form) {
    return c.html(<p>not found</p>)
  }

  const formData = form

  return c.html(
    <Form
      formId={formId}
      name={formData?.name}
      hometown={formData?.hometown}
    />
  )
})

export default app
