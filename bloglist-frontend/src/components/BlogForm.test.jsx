import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('form calls the event handler with the correct details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const titleInput = inputs[0]
  const authorInput = inputs[1]
  const urlInput = inputs[2]

  const sendButton = screen.getByRole('button', { name: /create/i })

  await user.type(titleInput, 'Testing Form Submissions')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'http://testurl.com')

  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)

  const submissionData = createBlog.mock.calls[0][0]
  expect(submissionData.title).toBe('Testing Form Submissions')
  expect(submissionData.author).toBe('Test Author')
  expect(submissionData.url).toBe('http://testurl.com')
})
