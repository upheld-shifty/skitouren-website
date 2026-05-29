export function TourCardSkeleton() {
  return (
    <div className="tour-card-skeleton" aria-hidden="true">
      <div className="tour-card-skeleton__image skeleton" />
      <div className="tour-card-skeleton__body">
        <div className="tour-card-skeleton__meta">
          <div className="tour-card-skeleton__badge skeleton" />
          <div className="tour-card-skeleton__badge skeleton" />
        </div>
        <div className="tour-card-skeleton__title skeleton" />
        <div className="tour-card-skeleton__title-short skeleton" />
        <div className="tour-card-skeleton__stats">
          <div className="tour-card-skeleton__stat skeleton" />
          <div className="tour-card-skeleton__stat skeleton" />
          <div className="tour-card-skeleton__stat skeleton" />
        </div>
      </div>
    </div>
  )
}

export function TourRowSkeleton() {
  return (
    <div className="tour-row-skeleton" aria-hidden="true">
      <div className="tour-row-skeleton__badges">
        <div className="tour-row-skeleton__badge skeleton" />
        <div className="tour-row-skeleton__badge skeleton" />
      </div>
      <div className="tour-row-skeleton__title skeleton" />
      <div className="tour-row-skeleton__stats">
        <div className="tour-row-skeleton__stat skeleton" />
        <div className="tour-row-skeleton__stat skeleton" />
      </div>
    </div>
  )
}
