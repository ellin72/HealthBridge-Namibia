import React, { useState, useEffect } from 'react';
import DocumentationViewer from '../components/DocumentationViewer';

const APIDocumentation: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/docs/API_DOCUMENTATION.md')
      .then((response) => response.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading API documentation:', error);
        setContent('# API Documentation\n\nContent is being loaded...');
        setLoading(false);
      });
  }, []);

  return <DocumentationViewer title="API Documentation" content={content} loading={loading} />;
};

export default APIDocumentation;

