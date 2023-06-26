import { Navigate, RootRoute, Route, Router } from "@tanstack/router";
import Root from "./components/Root";
import OverallPage from "./pages/overall/overall.page";
import ProjectsPage from "./pages/projects/projects.page";
import PromptsPage from "./pages/prompts/prompts.page";
import PromptCreatePage from "./pages/prompts/prompt.create";
import PromptPage from "./pages/prompts/prompt.page";

const rootRoute = new RootRoute({
  component: Root,
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <OverallPage />
  )
})

const projectRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: () => (
    <ProjectsPage />
  )
})

const promptsRoutes = new Route({
  getParentRoute: () => rootRoute,
  path: "/prompts",
  component: () => (
    <PromptsPage />
  )
})

const promptRoutes = new Route({
  getParentRoute: () => rootRoute,
  path: "/prompts/:id",
  component: () => (
    <PromptPage />
  )
})

const promptCreateRoutes = new Route({
  getParentRoute: () => rootRoute,
  path: "/prompts/new",
  component: () => (
    <PromptCreatePage />
  )
})

rootRoute.addChildren([
  indexRoute,
  projectRoute,
  promptsRoutes,
  promptRoutes,
  promptCreateRoutes,
])
export const router = new Router({
  routeTree: rootRoute
})