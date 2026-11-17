import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMemberProfile } from "../../hooks/use-member-profile";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { ProfileStatus } from "../../components/auth/profile-status";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import type { MemberInfo } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

function ProfileEditForm({ profile, token }: { profile: MemberInfo; token: string }) {
  const [nickname, setNickname] = useState(profile.nickname);
  const [checkedNickname, setCheckedNickname] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const updateMeMutation = useUpdateMeMutation();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const trimmed = nickname.trim();
  const valid = trimmed.length >= 2 && trimmed.length <= 12;
  const changed = trimmed !== profile.nickname;
  const canSubmit = valid && changed && checkedNickname === trimmed && !isChecking;

  async function checkNickname() {
    if (!valid || !changed || isChecking || updateMeMutation.isPending) return;
    setIsChecking(true);
    setCheckedNickname(null);
    setError("");
    try {
      const result = await checkNicknameDuplicate(trimmed);
      if (useAuthStore.getState().accessToken !== token) return;
      setCheckedNickname(result.available ? trimmed : null);
      alert(result.available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
    } catch {
      setError("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsChecking(false);
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;
    setError("");
    updateMeMutation.mutate({ nickname: trimmed }, {
      onSuccess: () => {
        if (useAuthStore.getState().accessToken !== token) return;
        void navigate({ to: "/me" });
      },
    });
  }

  return <form onSubmit={handleSubmit} noValidate className="flex min-h-[calc(100vh-230px)] flex-col">
    <div className="flex items-center justify-between gap-4">
      <div><h1 className="text-[28px] font-bold">내 정보 수정</h1><p className="mt-2 text-sm text-[#969da8]">닉네임을 변경할 수 있어요.</p></div>
      <button type="submit" disabled={!canSubmit || updateMeMutation.isPending} className="account-primary shrink-0">{updateMeMutation.isPending ? "저장 중" : "저장"}</button>
    </div>
    <div className="mt-10 grid gap-8 md:grid-cols-2">
      <div className="flex flex-col items-center py-5">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-[#e2e5eb]"><img src="/icons/person.svg" alt="기본 프로필" className="h-10 w-10" /></div>
        <p className="mt-3 text-sm font-bold">프로필 이미지</p><p className="mt-1 text-xs text-[#969da8]">이미지 변경은 준비 중이에요.</p>
      </div>
      <div className="space-y-5">
        <div>
          <label htmlFor="edit-nickname" className="mb-2 block text-sm font-bold">닉네임</label>
          <div className="relative">
            <input id="edit-nickname" autoComplete="nickname" value={nickname} disabled={isChecking || updateMeMutation.isPending} onChange={(e) => { setNickname(e.target.value); setCheckedNickname(null); setError(""); updateMeMutation.reset(); }} className="account-input pr-24" aria-invalid={!valid} aria-describedby="nickname-feedback" />
            <button type="button" onClick={checkNickname} disabled={!valid || !changed || isChecking || updateMeMutation.isPending} className="absolute inset-y-0 right-4 text-xs font-bold text-blue-600 disabled:opacity-50">{isChecking ? "확인 중" : "중복 확인"}</button>
          </div>
          <p id="nickname-feedback" role="status" className={`mt-2 text-xs ${!valid ? "text-red-500" : "text-[#969da8]"}`}>
            {!valid ? "닉네임은 2~12자로 입력해 주세요." : checkedNickname === trimmed ? "사용할 수 있는 닉네임이에요." : changed ? "변경한 닉네임의 중복 확인을 해 주세요." : "닉네임은 2~12자로 입력해 주세요."}
          </p>
        </div>
        <div><label htmlFor="edit-email" className="mb-2 block text-sm font-bold">이메일</label><input id="edit-email" type="email" value={profile.email} readOnly className="account-input text-[#6b7280]" /><p className="mt-2 text-xs text-[#969da8]">이메일은 변경할 수 없어요.</p></div>
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        {updateMeMutation.isError && <p role="alert" className="text-sm text-red-500">정보 수정에 실패했어요. 닉네임을 확인하고 다시 시도해 주세요.</p>}
        <Link to="/me" className="inline-block text-sm text-[#6b7280]">내 정보로 돌아가기</Link>
      </div>
    </div>
    <div className="mt-auto pt-16">
      <div className="flex items-center justify-between gap-4 rounded-lg border border-red-300 bg-red-50 p-5">
        <div><p className="text-sm font-bold text-red-500">회원 탈퇴</p><p className="mt-1 text-xs text-red-400">회원 탈퇴 기능은 준비 중이에요.</p></div>
        <button type="button" disabled className="shrink-0 rounded border border-red-300 bg-white px-4 py-3 text-sm text-red-400">회원 탈퇴</button>
      </div>
    </div>
  </form>;
}

export function ProfileEditPage() {
  const profile = useMemberProfile();
  return <main className="mx-auto w-full max-w-[1440px] px-[5.5%] py-8">
    {profile.data && !profile.isError && profile.token ? <ProfileEditForm key={profile.token} profile={profile.data} token={profile.token} /> : <ProfileStatus isError={profile.isError} onRetry={() => void profile.refetch()} />}
  </main>;
}
