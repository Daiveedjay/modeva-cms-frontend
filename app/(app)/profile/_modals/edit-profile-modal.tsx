"use client";

import { useGetAdminMe } from "@/app/_queries/admin/get-admin-me";
import { useUpdateAdminProfile } from "@/app/_queries/admin/update-admin-profile";
import {
  ComboItem,
  LocationComboBox,
} from "@/components/reuseables/location-combobox";
import { Spinner } from "@/components/reuseables/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCountries } from "@/hooks/use-countries";
import { AdminMeResponse } from "@/lib/types/admin";
import { toastSuccess } from "@/lib/utils";
import { Globe, Phone, Upload, User } from "lucide-react";
import Image from "next/image";
import { FormEvent, useRef, useState } from "react";

export function EditProfileModal({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) {
  const { data } = useGetAdminMe();
  const profile = data?.data;

  const { data: countries = [], isLoading: isLoadingCountries } =
    useCountries();

  if (!open) return null;
  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-120">
        <EditProfileInner
          profile={profile}
          countries={countries}
          isLoadingCountries={isLoadingCountries}
          close={close}
        />
      </DialogContent>
    </Dialog>
  );
}

function EditProfileInner({
  profile,
  countries,
  isLoadingCountries,
  close,
}: {
  profile: AdminMeResponse;
  countries: ComboItem[];
  isLoadingCountries: boolean;
  close: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{
    name: string;
    phone_number: string;
    country: string;
    avatar: File | string | null;
  }>({
    name: profile.name ?? "",
    phone_number: profile.phone_number ?? "",
    country: profile.country ?? "",
    avatar: profile.avatar ?? null,
  });

  const { mutateAsync: updateProfile, isPending } = useUpdateAdminProfile();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile({
        adminId: profile.id,
        name: formData.name,
        phone_number: formData.phone_number,
        country: formData.country,
        avatar: formData.avatar instanceof File ? formData.avatar : null,
      });

      toastSuccess("Profile updated successfully");
      close();
    } catch {
      // Error toast handled in API file
      // Keep modal open so user can retry
    }
  };

  const avatarPreview =
    formData.avatar instanceof File
      ? URL.createObjectURL(formData.avatar)
      : typeof formData.avatar === "string"
        ? formData.avatar
        : null;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold">
          Edit Profile
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        {/* Avatar */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4" />
            Profile Picture
          </Label>

          <div className="flex items-end gap-4">
            <div className="relative">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Profile avatar"
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-lg object-cover shadow-md"
                />
              ) : (
                <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center shadow-md">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setFormData((p) => ({ ...p, avatar: file }));
                }}
                disabled={isPending}
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                  disabled={isPending}>
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
                {formData.avatar instanceof File && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        avatar: profile.avatar ?? null,
                      }))
                    }
                    disabled={isPending}>
                    Clear
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                JPG, PNG, GIF up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4" />
            Full Name
          </Label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((p) => ({ ...p, name: e.target.value }))
            }
            required
            disabled={isPending}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Phone className="h-4 w-4" />
            Phone Number
          </Label>
          <Input
            value={formData.phone_number}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                phone_number: e.target.value,
              }))
            }
            disabled={isPending}
          />
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Globe className="h-4 w-4" />
            Country
          </Label>
          <LocationComboBox
            value={formData.country}
            onValueChange={(value) =>
              setFormData((p) => ({ ...p, country: value }))
            }
            items={countries}
            isLoading={isLoadingCountries}
            placeholder="Select country"
            disabled={isPending}
          />
        </div>

        <DialogFooter className="gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={close}
            disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || isLoadingCountries}>
            {isPending && <Spinner />}
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
