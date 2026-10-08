
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom' // FIX: Import Router
import { describe, test, expect } from 'vitest'
import Blog from './Blog'

describe('<Blog /> routing test configuration suite', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Master',
    id: 'abc123'
  }

  test('renders title and author inside Router wrapper', () => {
    render(
      <BrowserRouter>
        <Blog blog={blog} />
      </BrowserRouter>
    )

    const element = screen.getByText(/Component testing is done with react-testing-library/)
    expect(element).toBeDefined()
  })
})