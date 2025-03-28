import { render, screen } from '@testing-library/react';
import { SectionTitle } from '../SectionTitle';

describe('SectionTitle', () => {

  test('Should render correctly without link', () => {
    render(<SectionTitle title="Test Title" hasLink={false} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.queryByTestId('link')).not.toBeInTheDocument();
  });

  test('Should render correctly with a link', () => {
    render(<SectionTitle title="Test Title" hasLink linkText="Click me" linkhref="https://example.com" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('Should have a link URL correctly constructed with path', () => {

    render(<SectionTitle
      title="Test Title"
      hasLink
      linkText="Click me"
      linkhref="https://example.com"
      path="details"
    />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute('href', 'https://example.com/details');
  });

  test('Should have a link URL correctly constructed without path', () => {
    render(<SectionTitle
      title="Test Title"
      hasLink
      linkText="Click me"
      linkhref="https://example.com"
    />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  test('SHould have link with empty text', () => {
    render(<SectionTitle
      title="Test Title"
      hasLink
      linkText=""
      linkhref="https://example.com"
    />);

    const link = screen.getByTestId('link-id');
    expect(link).toBeEmptyDOMElement();
  });

  test('Should have Link component a attribute as target=_self', () => {
    render(<SectionTitle
      title="Test Title"
      hasLink
      linkText="Click me"
      linkhref="https://example.com"
    />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_self');
  });

  test('Should change the path when url updated', () => {
    const { rerender } = render(<SectionTitle
      title="Test Title"
      hasLink
      linkText="Click me"
      linkhref="https://example.com"
      path="home"
    />);

    let link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/home');

    // Re-render with a different path
    rerender(<SectionTitle
      title="Test Title"
      hasLink
      linkText="Click me"
      linkhref="https://example.com"
      path="about"
    />);

    link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/about');
  });
});
