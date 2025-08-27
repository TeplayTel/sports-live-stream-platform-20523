import { render } from '@testing-library/react';
import App from './App';

test('renders minimal emoji bar page without crashing', () => {
  render(<App />);
  // No assertions on specific text; test ensures component mounts successfully.
});
