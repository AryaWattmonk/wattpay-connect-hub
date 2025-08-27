import React from 'react';

const TestPage: React.FC = () => {
  console.log("TestPage.tsx: TestPage component rendering.");
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Hello from Wattpay Connect Hub Extension!</h1>
      <p>This is a test page to confirm React rendering.</p>
    </div>
  );
};

export default TestPage;
