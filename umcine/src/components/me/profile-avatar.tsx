interface ProfileAvatarProps {
  imageUrl: string | null;
}

export function ProfileAvatar({ imageUrl }: ProfileAvatarProps) {
  return (
    <div className="flex size-[91px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
      {imageUrl ? (
        <img src={imageUrl} alt="프로필 이미지" className="size-full object-cover" />
      ) : (
        <img src="/icons/person.svg" alt="" className="size-10" />
      )}
    </div>
  );
}
