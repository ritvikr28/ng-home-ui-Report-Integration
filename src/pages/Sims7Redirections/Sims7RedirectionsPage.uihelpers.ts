// UI orchestration helpers for Sims7RedirectionsPage.view.tsx
import { IBreadcrumbLink, NotificationStatus, DialogTemplate } from "@essnextgen/ui-kit";

export function getBreadcrumbs(t: (key: string) => string, homeurl: string): IBreadcrumbLink[] {
    return [
        {
            active: true,
            linkName: `${t("homePage.appTitle")}`,
            path: "/"
        },
        {
            active: false,
            linkName: `${t("breadcrumbsadminconsole")}`,
            path: homeurl
        },
        {
            active: false,
            linkName: `${t("SIMS7Redirects.title")}`,
            path: "/"
        }
    ];
}

export function getNotificationMsgBannerObject(t: (key: string) => string) {
    return [
        {
            isShow: true,
            variant: "warning",
            title: t("SIMS7Redirects.apiFailureMessage"),
            message: t("SIMS7Redirects.apiFailureDescription"),
            autoclose: true
        }
    ];
}

export function getDialogTemplateProps(t: (key: string) => string) {
    return {
        cancelText: "Cancel",
        contentText: t("SIMS7Redirects.discardChangesDescription"),
        isNotificationanner: false,
        notificationStatus: NotificationStatus.SUCCESS,
        okText: "Discard",
        onCancel: () => {},
        onConfirm: () => {},
        template: DialogTemplate.Confirmation
    };
}
