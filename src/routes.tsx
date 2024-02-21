import OverallPage from './pages/overall/overall.page'
import ProjectsPage from './pages/projects/projects.page'
import PromptsPage from './pages/prompts/prompts.page'
import PromptCreatePage from './pages/prompts/prompt.create'
import PromptPage from './pages/prompts/prompt.page'
import { createBrowserRouter } from 'react-router-dom'
import ProjectCreatePage from './pages/projects/project.create'
import ProjectEditPage from './pages/projects/project.edit'
import ProjectPage from './pages/projects/project.page'
import BaseLayout from './components/layout/Base'
import ProjectLayout from './components/layout/ProjectLayout'
import LandingPage from './pages/landing/Landing'
import AuthorizePage from './pages/auth/authorize.page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        index: true,
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/auth',
        element: <AuthorizePage />
      },
      {
        path: '/projects',
        // element: <Outlet />,
        children: [
          {
            path: '',
            index: true,
            element: <ProjectsPage />
          },
          {
            path: 'new',
            element: <ProjectCreatePage />
          },
        ]
      },
      {
        path: '/:pid',
        element: <ProjectLayout />,
        children: [
          {
            path: '',
            index: true,
            element: <OverallPage />
          },
          {
            path: 'view',
            element: <ProjectPage />
          },
          {
            path: 'edit',
            element: <ProjectEditPage />
          },
          {
            path: 'prompts',
            element: <PromptsPage />,
          },
          {
            path: 'prompts/new',
            element: <PromptCreatePage />,
          },
          {
            path: 'prompts/:id',
            element: <PromptPage />,
          },
          {
            path: 'prompts/:id/edit',
            element: <PromptCreatePage isUpdate />,
          }
        ]
      },
    ]
  }
])