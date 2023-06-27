import Root from "./components/Root";
import OverallPage from "./pages/overall/overall.page";
import ProjectsPage from "./pages/projects/projects.page";
import PromptsPage from "./pages/prompts/prompts.page";
import PromptCreatePage from "./pages/prompts/prompt.create";
import PromptPage from "./pages/prompts/prompt.page";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <OverallPage />
      },
      {
        path: '/projects',
        element: <ProjectsPage />,
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