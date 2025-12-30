import React, { useState, useEffect } from 'react';
import DocumentationViewer from '../components/DocumentationViewer';

const PrivacyPolicy: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/docs/PRIVACY_POLICY.md')
      .then((response) => response.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading privacy policy:', error);
        setContent('# Privacy Policy\n\nContent is being loaded...');
        setLoading(false);
      });
  }, []);

  return <DocumentationViewer title="Privacy Policy" content={content} loading={loading} />;
};

export default PrivacyPolicy;

