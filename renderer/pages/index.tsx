import { useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

const IndexPage = () => {
  useEffect(() => {
    // add a listener to 'message' channel
    if (window.electronAPI) {
      window.electronAPI.onMessage(value => {
        alert(value);
      });
    }
  }, []);

  const onSayHiClick = () => {
    if (window.electronAPI) window.electronAPI.message('hi from next');
  };

  return (
    <Layout title="Home | Next.js + TypeScript + Electron Example">
      <h1>Hello Next.js 👋</h1>
      <button onClick={onSayHiClick}>Say hi to electron</button>
      <p>
        <Link href="/about">About</Link>
      </p>
    </Layout>
  );
};

export default IndexPage;
