import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import SingleBlogView from './SingleBlogView'

describe('<SingleBlogView /> unit permissions matrix', () => {
  const mockBlog = {
    id: '12345',
    title: 'Component Testing with Vitest',
    author: 'Test Master',
    url: 'https://vitest.dev',
    likes: 42,
    user: {
      username: 'original_creator',
      name: 'Original Creator',
      id: 'user_001',
    },
  }

  const mockLikeHandler = vi.fn()
  const mockRemoveHandler = vi.fn()

  test('displays core information and likes to unauthenticated users, but hides buttons', () => {
    render(
      <SingleBlogView
        blog={mockBlog}
        handleLike={mockLikeHandler}
        handleRemove={mockRemoveHandler}
        currentUser={null}
      />,
    )

    expect(screen.getByText(/Component Testing with Vitest/)).toBeDefined()
    expect(screen.getByText(/https:\/\/vitest.dev/)).toBeDefined()
    expect(screen.getByText(/42/)).toBeDefined()

    const likeButton = screen.queryByRole('button', { name: /like/i })
    const removeButton = screen.queryByRole('button', {
      name: /remove|delete/i,
    })

    expect(likeButton).toBeNull()
    expect(removeButton).toBeNull()
  })

  test('displays only the like button to authenticated non-creators', () => {
    const intruderUser = {
      username: 'intruder_reader',
      name: 'Intruder User',
      id: 'user_999',
    }

    render(
      <SingleBlogView
        blog={mockBlog}
        handleLike={mockLikeHandler}
        handleRemove={mockRemoveHandler}
        currentUser={intruderUser}
      />,
    )

    const likeButton = screen.getByRole('button', { name: /like/i })
    expect(likeButton).toBeDefined()

    const removeButton = screen.queryByRole('button', {
      name: /remove|delete/i,
    })
    expect(removeButton).toBeNull()
  })

  test('displays both like and delete buttons to the original blog creator', () => {
    const creatorUser = {
      username: 'original_creator',
      name: 'Original Creator',
      id: 'user_001',
    }

    render(
      <SingleBlogView
        blog={mockBlog}
        handleLike={mockLikeHandler}
        handleRemove={mockRemoveHandler}
        currentUser={creatorUser}
      />,
    )

    const likeButton = screen.getByRole('button', { name: /like/i })
    const removeButton = screen.getByRole('button', { name: /remove|delete/i })

    expect(likeButton).toBeDefined()
    expect(removeButton).toBeDefined()
  })
})
