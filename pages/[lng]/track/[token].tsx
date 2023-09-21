/* library package */
import {
  ShipmentTracker,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
/* library template */
import { useBrandCommon } from 'lib/useBrand'
/* component */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
/* styles */
import styles from 'public/scss/pages/Track.module.scss'

const classesTrackerPage = {
  shipmentHeaderClassName: `${styles.track_shipmentHeader} ${styles.track_shipmentHeaderGuest}`,
  shipmentBodyClassName: `${styles.track_shipmentBody} ${styles.track_shipmentBodyGuest} d-flex justify-content-center`,
  shipmentFooterClassName: `${styles.track_shipmentFooter} d-flex justify-content-center text-center`,
  shipmentTrackingClassName: styles.track_shipmentTracking,
  shipmentHeaderTextClassName: styles.track_shipmentHeaderText,
  shipmentTextClassName: styles.track_shipmentText,
  shipmentNoteClassName: styles.track_shipmentNote,
  shipmentListClassName: styles.track_shipmentList,
  shipmentListWrapperClassName: styles.track_shipmentListWrapper,
  shipmentCloseIconClassName: styles.track_shipmentCloseIcon,
  shipmentTrackButtonClassName: `${styles.track_shipmentTrackButton} ${styles.track_shipmentTrackButtonGuest}`,
}

const TrackerPage = ({ order_token, lngDict, lng, brand }) => {

  const i18n: any = useI18n()
  const linksBreadcrumb = [`${i18n.t("header.home")}`, i18n.t("shipping.track")]
  const layoutProps = {
    lngDict, i18n, lng, brand,
    SEO: { title: i18n.t("shipping.track") },
    withBack: false
  }

  return (
    <Layout {...layoutProps}>
      <Breadcrumb title={i18n.t("shipping.track")} links={linksBreadcrumb} lng={lng} />
      <div className={styles.track_container}>
        <ShipmentTracker
          token={order_token}
          iconTracker={
            <div className={styles.track_trackerIcon} />
          }
          classes={classesTrackerPage}
        />
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ 
  req,
  res,
  params
}) {
  const tokenData = await useAuthToken({ req, res, env: process.env }); 
	const token = tokenData.value; 
  const { brand } = await useBrandCommon(req, params, token)

  return {
    props: {
      ...brand,
      order_token: params.token
    }
  }
}

export default TrackerPage