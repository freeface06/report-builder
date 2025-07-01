import React from "react";
import { render } from '@testing-library/react';

function Dummy() {
  return <div>Hello</div>;
}

test('renders without crashing', () => {
  render(<Dummy />);
});
