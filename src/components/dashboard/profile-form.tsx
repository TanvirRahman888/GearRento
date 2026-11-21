
"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Loader2,
  Save,
  UserRound,
  ImageIcon,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";

type ProfileFormProps = {
  initialName: string;
  initialImage: string | null;
  email: string;
  roleLabel: string;
};

function isValidImageUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" ||
      url.protocol === "http:"
    );
  } catch {
    return false;
  }
}

export function ProfileForm({
  initialName,
  initialImage,
  email,
  roleLabel,
}: ProfileFormProps) {
  const router = useRouter();
  const { refetch } = useSession();

  const [name, setName] = useState(initialName);
  const [photoUrl, setPhotoUrl] = useState(
    initialImage || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  // Preview only when the URL is valid
  const previewUrl =
    photoUrl.trim() && isValidImageUrl(photoUrl.trim())
      ? photoUrl.trim()
      : null;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isLoading) return;

    const cleanName = name.trim();
    const cleanImage = photoUrl.trim();

    // Name validation
    if (cleanName.length < 2) {
      toast.error("Name must contain at least 2 characters.");
      return;
    }

    // Image URL validation
    if (cleanImage && !isValidImageUrl(cleanImage)) {
      toast.error("Please enter a valid image URL.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: cleanName,

        // Blank means keep the existing image.
        ...(cleanImage ? { image: cleanImage } : {}),
      });

      if (error) {
        toast.error(
          error.message || "Failed to update profile."
        );
        return;
      }

      toast.success("Profile updated successfully!");

      // Refresh Better Auth session and Server Components
      await refetch();
      router.refresh();
    } catch (error) {
      console.error("Profile update failed:", error);

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7"
    >
      {/* Header and Avatar Preview */}
      <div className="flex items-center gap-4 border-b border-border pb-5">
        <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-primary">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Profile photo preview"
              fill
              sizes="64px"
              unoptimized
              className="object-cover"
            />
          ) : (
            <UserRound size={32} />
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Update your GearRento profile.
          </p>
        </div>
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="profile-name"
          className="mb-2 block text-sm font-medium"
        >
          Full Name
        </label>

        <div className="relative">
          <UserRound
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary"
          />

          <input
            id="profile-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            disabled={isLoading}
            required
            className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
      </div>

      {/* Photo URL */}
      <div>
        <label
          htmlFor="profile-image"
          className="mb-2 block text-sm font-medium"
        >
          Profile Photo URL
        </label>

        <div className="relative">
          <ImageIcon
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary"
          />

          <input
            id="profile-image"
            type="url"
            value={photoUrl}
            onChange={(event) =>
              setPhotoUrl(event.target.value)
            }
            disabled={isLoading}
            placeholder="https://example.com/photo.jpg"
            className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Enter an image URL to update your photo.
          Leave it blank to keep your existing photo.
        </p>
      </div>

      {/* Read-only Email */}
      <div>
        <label
          htmlFor="profile-email"
          className="mb-2 block text-sm font-medium"
        >
          Email Address
        </label>

        <div className="relative">
          <Mail
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            id="profile-email"
            type="email"
            value={email}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-border bg-muted py-3 pl-11 pr-4 text-sm text-muted-foreground"
          />
        </div>
      </div>

      {/* Read-only Role */}
      <div>
        <label
          htmlFor="profile-role"
          className="mb-2 block text-sm font-medium"
        >
          Account Role
        </label>

        <div className="relative">
          <ShieldCheck
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            id="profile-role"
            type="text"
            value={roleLabel}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-border bg-muted py-3 pl-11 pr-4 text-sm text-muted-foreground"
          />
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Your authorization role cannot be changed here.
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end border-t border-border pt-5">
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cta px-5 py-3 text-sm font-semibold text-cta-foreground transition-colors hover:bg-cta/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
