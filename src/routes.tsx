import { Navigate, RootRoute, Route, Router } from "@tanstack/router";
import Root from "./components/Root";
import StatsPage from "./pages/stats/stats.page";
import ProjectsPage from "./pages/projects/projects.page";

const rootRoute = new RootRoute({
  component: Root,
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <StatsPage />
  )
})

const projectRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: () => (
    <ProjectsPage />
  )
})

rootRoute.addChildren([indexRoute, projectRoute])
export const router = new Router({
  routeTree: rootRoute
})