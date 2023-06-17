import Navbar from '../Navbar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className='m-2'>{children}</main>
    </>
  );
};
