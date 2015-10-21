import RightSidebar from './RightSidebar'
export {RightSidebar as RightSidebar}

// Register reactive element.
if (document.registerReact) {
  document.registerReact('grape-right-sidebar', RightSidebar)
}
