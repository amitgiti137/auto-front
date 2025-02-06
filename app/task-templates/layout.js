import RightSidebar from "../component/RightSidebar";


export const metadata = {
    title: "Automated-World",
    description: `Welcome to the Automated World`,
};

export default function Layout({ children }) {
    return (
      <>
        <RightSidebar/>
        {children}
      </>
    )
  }