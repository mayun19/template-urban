/* library package */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { 
  useAuthToken,
  useI18n,
  usePaymentLink
} from '@sirclo/nexus'
/* library component */
import { useBrandCommon } from 'lib/useBrand'
/* component */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
/* styles */
import styles from 'public/scss/pages/PaymentStatus.module.scss'

type TypePaymentStatus = {
  title?: string,
  contentDesc?: string
}

const PaymentStatus: FC<any> = ({
  lng,
  lngDict,
  brand,
  orderID,
  status
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const router = useRouter()
  const { data } = usePaymentLink(orderID)

  let paymentStatus: TypePaymentStatus

  if (data === undefined || status === null) status = "orderNotFound"
  if (status === "failed") {
    paymentStatus = {
      title: i18n.t("paymentStatus.titleFailed"),
      contentDesc: i18n.t("paymentStatus.failedDesc")
    }
  } else if (status === "unfinish") {
    paymentStatus = {
      title: i18n.t("paymentStatus.titleUnfinish"),
      contentDesc: i18n.t("paymentStatus.unfinishDesc")
    }
  } else {
    paymentStatus = {
      title: i18n.t("paymentStatus.orderNotFound")
    }
  }

  const linksBreadcrumb = [`${i18n.t("header.home")}`, i18n.t("orderHistory.lineItemDelivered")]
  const layoutProps = {
    lngDict, i18n, lng, brand,
    SEO: { title: `${i18n.t("orderSummary.placeOrder")}` },
    withHeader: false,
    withFooter: false
  }

  return (
    <Layout {...layoutProps}>
      <section className={`${styles.breadcumbSection} ${status}`}>
        <Breadcrumb
          bgBlack
          title={paymentStatus?.title}
          links={linksBreadcrumb}
          lng={lng}
        />
      </section>
      <section className="container">
        <div className={styles.container}>
          <div className={styles.inner}>
            {!["orderNotFound", ""].includes(status) &&
              <div className={styles.content}>
                <p className={styles.contentDesc}>
                  {paymentStatus?.contentDesc}
                </p>
              </div>
            }
            <div className={styles.action}>
              {status !== 'unfinish' &&
                <div className={styles.actionButton}>
                  <button
                    className={styles.button}
                    onClick={() => router.push("/[lng]/products", `/${lng}/products`)}
                  >
                    {i18n.t("paymentStatus.continueShopping")}
                  </button>
                </div>
              }
              {status !== 'orderNotFound' &&
                <div className={styles.actionButton}>
                  <button
                    className={styles.button}
                    onClick={() => {
                      window.location.href = data.orders[0].paymentLinks[0];
                    }}
                  >
                    {i18n.t("paymentStatus.tryAgain")}
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ 
  req,
  res,
  params 
}) => {
  const tokenData = await useAuthToken({ req, res, env: process.env }); 
	const token = tokenData.value; 
  const { brand } = await useBrandCommon(req, params, token)
  const [orderID, status] = params?.orderID as string[]

  return {
    props: {
      ...brand,
      orderID: orderID || "",
      status: status || "",
    }
  }
}

export default PaymentStatus