"use client";

import { useMemo } from "react";
import { EmptyState, Tabs, type TabItem } from "@/src/shared/ui";
import type { Review, ReviewStatus } from "@/src/features/reviews";
import { ReviewCard } from "./ReviewCard";

export interface ReviewsModerationPanelProps {
  reviews: Review[];
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
  onRespond?: (id: string, text: string) => void;
}

const TAB_LABELS: Record<ReviewStatus, string> = {
  pending: "Pendientes",
  approved: "Aprobadas",
  rejected: "Rechazadas",
};

const ORDER: ReviewStatus[] = ["pending", "approved", "rejected"];

export function ReviewsModerationPanel({
  reviews,
  onApprove,
  onReject,
  onRespond,
}: ReviewsModerationPanelProps) {
  const grouped = useMemo(() => {
    const map: Record<ReviewStatus, Review[]> = {
      pending: [],
      approved: [],
      rejected: [],
    };
    for (const r of reviews) {
      map[r.status].push(r);
    }
    return map;
  }, [reviews]);

  const items: TabItem[] = ORDER.map((status) => {
    const list = grouped[status];
    return {
      id: status,
      label: `${TAB_LABELS[status]} (${list.length})`,
      content:
        list.length === 0 ? (
          <EmptyState
            title="Sin reviews"
            description={`No hay reviews en estado ${TAB_LABELS[status].toLowerCase()}.`}
          />
        ) : (
          <ul className="space-y-3">
            {list.map((r) => (
              <li key={r.id}>
                <ReviewCard
                  review={r}
                  onApprove={onApprove}
                  onReject={onReject}
                  onRespond={onRespond}
                />
              </li>
            ))}
          </ul>
        ),
    };
  });

  return <Tabs items={items} defaultActiveId="pending" />;
}
