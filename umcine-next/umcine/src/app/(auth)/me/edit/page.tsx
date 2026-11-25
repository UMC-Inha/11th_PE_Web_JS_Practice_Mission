import { MyEditPage } from "@/views/members/my-edit-page";

// 기존 routes/_auth/me_.edit.tsx → /me/edit
// me 폴더에 layout.tsx가 없어서 /me 화면 안에 중첩되지 않음 (TanStack의 me_ 와 같은 효과)
export default function Page() {
  return <MyEditPage />;
}
