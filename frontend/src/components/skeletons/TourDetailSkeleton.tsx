export function TourDetailSkeleton() {
  return (
    <div className="container tour-detail-skeleton" aria-hidden="true">
      <div className="tour-detail-skeleton__image skeleton" />
      <div className="tour-detail-skeleton__title skeleton" />
      <div className="tour-detail-skeleton__subtitle skeleton" />
      <div className="tour-detail-skeleton__stats">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="tour-detail-skeleton__stat skeleton" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`tour-detail-skeleton__text skeleton${i === 4 ? ' tour-detail-skeleton__text--short' : ''}`}
        />
      ))}
    </div>
  )
}
