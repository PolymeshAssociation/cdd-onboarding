import { createBrowserRouter, Outlet } from "react-router-dom";

import { MainTemplate } from '@polymeshassociation/polymesh-theme/ui/templates';

import Landing from "./Landing";
import NotFound from "./NotFound";
import Verification from "./Verification";
import Result from "./Result";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <MainTemplate children={<Outlet />} />,
      children: [
        {
          path: "/",
          element: <Landing />,
        },
        {
          path: "/result/:provider/:result",
          element: <Result />
        },
        {
          path: "*",
          element: <NotFound />,
        }
      ],
    },
    {
      path: "verification",
      element: <Verification />,
    },
  ]);
  