import React, { useState, useEffect } from 'react';
import DocumentationViewer from '../components/DocumentationViewer';

const UserGuide: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/docs/USER_GUIDE.md')
      .then((response) => response.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading user guide:', error);
        setContent('# User Guide\n\nContent is being loaded...');
        setLoading(false);
      });
  }, []);

  return <DocumentationViewer title="User Guide" content={content} loading={loading} />;
};

export default UserGuide;

