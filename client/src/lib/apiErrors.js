// Maps a backend business-error `errorCode` (see server controllers) to a
// translated message for dashboard.errors.*. Falls back to the caller-provided
// generic message for unexpected errors (5xx) or unrecognized codes.
export function getErrorMessage(t, error, { locale, fallback } = {}) {
  const errorCode = error?.response?.data?.errorCode;
  const errorData = error?.response?.data?.errorData || {};

  switch (errorCode) {
    case 'ARTWORK_HAS_ACTIVE_ORDER':
      return t('dashboard.errors.ARTWORK_HAS_ACTIVE_ORDER', errorData);

    case 'ORDER_STATUS_ARTWORK_CONFLICT': {
      const artworkTitles = (errorData.artworks || [])
        .map((artwork) => artwork.title?.[locale] || artwork.title?.en)
        .join(', ');
      return t('dashboard.errors.ORDER_STATUS_ARTWORK_CONFLICT', { artworkTitles });
    }

    case 'REFUND_NOT_PENDING':
      return t('dashboard.errors.REFUND_NOT_PENDING');

    case 'REFUND_MISSING_FIELDS':
      return t('dashboard.refundMissingFields');

    default:
      return fallback;
  }
}
