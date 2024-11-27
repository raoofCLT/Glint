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
import { NotificationProps, WorkspaceProps } from "@/types/index.type";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Modal from "../modal";
import { Menu, PlusCircle } from "lucide-react";
import Search from "../search";
import { MENU_ITEMS } from "@/constants";
import SidebarItem from "./sidebar-items";
import { getNotifications } from "@/actions/user";
import WorkspacePlaceholder from "./workspace-placeholder";
import GlobalCard from "../global-card";
import { Button } from "@/components/ui/button";
import Loader from "../loader";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import InfoBar from "../info-bar";

type Props = {
  activeWorkspaceId: string;
};

const Sidebar = ({ activeWorkspaceId }: Props) => {
  const router = useRouter();
  const pathName = usePathname();
  const { data, isFetched } = useQueryData(["user-workspaces"], getWorkSpaces);
  const menuitems = MENU_ITEMS(activeWorkspaceId);

  const { data: notifications } = useQueryData(
    ["user-notifications"],
    getNotifications
  );

  const { data: workspace } = data as WorkspaceProps;
  const { data: count } = notifications as NotificationProps;

  const onChangeActiveWorkspace = (value: string) => {
    router.push(`/dashboard/${value}`);
  };

  const currentWorkspace = workspace.workspace.find(
    (s) => s.id === activeWorkspaceId
  );

  const SidebarSection = (
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
      {currentWorkspace?.type === "PUBLIC" &&
        workspace.subscription?.plan == "PRO" && (
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
            <Search workspaceId={activeWorkspaceId} />
          </Modal>
        )}
      <p className="w-full text-[#9D9D9D] font-bold mt-4">Menu</p>

      <nav className="w-full">
        <ul>
          {menuitems.map((item) => (
            <SidebarItem
              key={item.title}
              href={item.href}
              icon={item.icon}
              selected={pathName === item.href}
              title={item.title}
              notification={
                (item.title === "Notification" &&
                  count._count &&
                  count._count.notification) ||
                0
              }
            />
          ))}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      <p className="w-full text-[#9D9D9D] font-bold mt-4">Workspace</p>

      {workspace.workspace.length === 1 && workspace.members.length === 0 && (
        <div className="w-full mt-[-10px]">
          <p className="text-[#3c3c3c] font-medium text-sm">
            {workspace.subscription?.plan === "FREE"
              ? "Upgrade to create workspaces"
              : "No workspaces"}
          </p>
        </div>
      )}

      <nav className="w-full">
        <ul className="h-[150px] overflow-auto overflow-x-hidden fade-layer">
          {workspace.workspace.length > 0 &&
            workspace.workspace.map((item) => (
              <SidebarItem
                key={item.name}
                title={item.name}
                href={`/dashboard/${item.id}`}
                selected={pathName === `/dashboard/${item.id}`}
                notification={0}
                icon={
                  <WorkspacePlaceholder>
                    {item.name.charAt(0)}
                  </WorkspacePlaceholder>
                }
              />
            ))}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      {workspace.subscription?.plan === 'FREE' && (
        <GlobalCard
          title="Upgrade to Pro"
          description="Unlock AI features like transcription, AI summary, and more."
          footer={
            <Button className="text-sm w-full mt-2">
              <Loader color="#000" state={false}>Upgrade</Loader>
            </Button>
          }
        />
      )}
    </div>
  );
  return (
    <div className="full">
      <InfoBar />
      <div className="md:hidden fixed my-4">
        <Sheet>
          <SheetTrigger asChild className="ml-2">
            <Button variant={"ghost"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="p-0 w-fit h-full">
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      <div className="md:block hidden h-full">{SidebarSection}</div>
    </div>
  );
};
export default Sidebar;
