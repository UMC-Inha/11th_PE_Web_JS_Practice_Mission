import { createFileRoute } from "@tanstack/react-router";
import { MyEditPage } from "../../pages/members/my-edit-page";

// me_ 의 _ 는 /me 페이지 안에 중첩하지 않고 따로 렌더링한다는 뜻
export const Route = createFileRoute("/_auth/me_/edit")({
  component: MyEditPage,
});
