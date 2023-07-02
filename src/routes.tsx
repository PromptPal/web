import Root from "./components/Root";
import OverallPage from "./pages/overall/overall.page";
import ProjectsPage from "./pages/projects/projects.page";
import PromptsPage from "./pages/prompts/prompts.page";
import PromptCreatePage from "./pages/prompts/prompt.create";
import PromptPage from "./pages/prompts/prompt.page";
import { Outlet, createBrowserRouter } from "react-router-dom";
import ProjectCreatePage from "./pages/projects/project.create";
import ProjectEditPage from "./pages/projects/project.edit";
import ProjectPage from "./pages/projects/project.page";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        path: '/',
        element: <OverallPage />
      },
      {
        path: '/projects',
        element: <Outlet />,
        children: [
          {
            path: ':id',
            index: true,
            element: <ProjectsPage />
          },
          {
            path: ':id',
            element: <ProjectPage />
          },
          {
            path: ':id/edit',
            element: <ProjectEditPage />
          },
          {
            path: ':id/prompts',
            element: <PromptsPage />
          },
          {
            path: 'new',
            element: <ProjectCreatePage />
          },
        ]
      },
      {
        path: '/prompts',
        element: <PromptsPage />,
      },
      {
        path: '/prompts/new',
        element: <PromptCreatePage />,
      },
      {
        path: '/prompts/:id',
        element: <PromptPage />,
      },
      {
        path: '/prompts/:id/edit',
        element: <PromptCreatePage />,
      }
    ]
  }
])