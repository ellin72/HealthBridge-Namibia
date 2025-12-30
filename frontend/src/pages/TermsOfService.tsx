import React, { useState, useEffect } from 'react';
import DocumentationViewer from '../components/DocumentationViewer';

const TermsOfService: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/docs/TERMS_OF_SERVICE.md')
      .then((response) => response.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading terms of service:', error);
        setContent('# Terms of Service\n\nContent is being loaded...');
        setLoading(false);
      });
  }, []);

  return <DocumentationViewer title="Terms of Service" content={content} loading={loading} />;
};

export default TermsOfService;

