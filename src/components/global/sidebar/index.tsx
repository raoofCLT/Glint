"use client";

import { getWorkSpaces } from "@/actions/workspace";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useQueryData } from "@/hooks/userQueryData";
import { WorkspaceProps } from "@/types/index.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import Modal from "../modal";
import { PlusCircle } from "lucide-react";

type Props = {
  activeWorkspaceId: string;
};

const Sidebar = ({ activeWorkspaceId }: Props) => {
  const router = useRouter();
  const { data, isFetched } = useQueryData(["user-workspaces"], getWorkSpaces);

  const { data: workspace } = data as WorkspaceProps;

  const onChangeActiveWorkspace = (value: string) => {
    router.push(`/dashboard/${value}`);
  };
  return (
    <div className="bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden">
      <div className="bg-[#111111] p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0">
        <Image src="/glint-logo.svg" height={40} width={40} alt="logo" />
        <p className="text-2xl">Glint</p>
      </div>
      <Select
        defaultValue={activeWorkspaceId}
        onValueChange={onChangeActiveWorkspace}
      >
        <SelectTrigger className="mt-16 text-neutral-400 bg-transparent">
          <SelectValue placeholder="Select a workspace">
            <SelectContent className="bg-[#111111] backdrop-blur-xl">
              <SelectGroup>
                <SelectLabel>Workspaces</SelectLabel>
                <Separator />
                {workspace.workspace.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </SelectItem>
                ))}
                {workspace.members.length > 0 &&
                  workspace.members.map(
                    (workspace) =>
                      workspace.Workspace && (
                        <SelectItem
                          value={workspace.Workspace.id}
                          key={workspace.Workspace.id}
                        >
                          {workspace.Workspace.name}
                        </SelectItem>
                      )
                  )}
              </SelectGroup>
            </SelectContent>
          </SelectValue>
        </SelectTrigger>
      </Select>
      <Modal
        trigger={
          <span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90 hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2">
            <PlusCircle
              size={15}
              className="text-neutral-800/90 fill-neutral-500"
            />
            <span className="text-neutral-400 font-semibold text-xs">
              Invite To Workspace
            </span>
          </span>
        }
        title="Invite To Workspace"
        description="Invite other user to your workspace"
      >
        WorkspaceSearch
      </Modal>
    </div>
  );
};

export default Sidebar;
