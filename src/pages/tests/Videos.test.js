import { render, screen, waitFor } from '@testing-library/react';
import { Route } from 'react-router-dom';
import { withAllContexts, withRouter } from '../../tests/utils';
import { fakeVideo, fakeVideos } from '../../tests/videos'
import Videos from '../Videos'

describe('Videos component', () => {
  const fakeYoutube = {
    search: jest.fn()
  }

  beforeEach(() => {
    fakeYoutube.search.mockImplementation((keyword) => {
      return keyword ? [fakeVideo] : fakeVideos;
    })
  });

  afterEach(() => {
    fakeYoutube.search.mockReset();
  });

  it('renders all videos when keyword is not specified', async () => {
    renderWithPath('/');

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders error state when fething items fails', async () => {
    fakeYoutube.search.mockImplementation(async () => {
      throw new Error('error');
    })

    renderWithPath('/');


    await waitFor(() => {
      expect(screen.getByText(/Something is wrong/i)).toBeInTheDocument();
    })
  })

  function renderWithPath(path) {
    return render(
      withAllContexts(
        withRouter(
          <>
            <Route path='/' element={<Videos />} />
            <Route path='/:keyword' element={<Videos />} />
          </>,
          path
        ),
        fakeYoutube
      )
    )
  }
});