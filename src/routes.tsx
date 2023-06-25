import { RootRoute, Router } from "@tanstack/router";
import Root from "./components/Root";


const rootRoute = new RootRoute({
  component: Root,
})


export const router = new Router({
  routeTree: rootRoute
})