export function ProfileStatus({ isError, onRetry }: { isError: boolean; onRetry: () => void }) {
  return (
    <div className="py-20 text-center" role={isError ? "alert" : "status"}>
      <p>{isError ? "내 정보를 불러오지 못했어요." : "내 정보를 불러오는 중이에요."}</p>
      {isError && <button className="mt-4 font-bold text-blue-600" onClick={onRetry}>다시 시도</button>}
    </div>
  );
}
