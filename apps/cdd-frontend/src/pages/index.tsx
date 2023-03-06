import { createBrowserRouter } from "react-router-dom";

import Landing from "./Landing";
import NotFound from "./NotFound";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
      // children: [
      //   {
      //     path: "team",
      //     element: <Team />,
      //     loader: teamLoader,
      //   },
      // ],
    },
    {
      path: "*",
      element: <NotFound />,
    }
  ]);
  