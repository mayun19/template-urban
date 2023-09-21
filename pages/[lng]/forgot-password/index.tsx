/*library package */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  ResetPassword,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
import { toast } from 'react-toastify'
/* library component */
import { parseCookies } from 'lib/parseCookies'
import redirectIfAuthenticated from 'lib/redirectIfAuthenticated'
import { useBrandCommon } from 'lib/useBrand'
/* component */
import Layout from 'components/Layout/Layout'
import Loader from 'components/Loader/Loader'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import useWindowSize from 'lib/useWindowSize'
/* styles */
import styles from 'public/scss/pages/ForgotPassword.module.scss'

const classesResetPassword = {
  inputClassName: styles.input,
  buttonClassName: styles.button,
}

const ForgotPassword: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n()
  const size = useWindowSize()
  const [page, setPage] = useState<string>("forgotPassword")
  const linksBreadcrumb = [`${i18n.t("header.home")}`, i18n.t("resetPassword.title")]
  const layoutProps = {
    lngDict, i18n, lng, brand,
    SEO: { title: i18n.t("forgotPassword.title") }
  }

  return (
    <Layout {...layoutProps}>
      <Breadcrumb
        title={page === "forgotPassword" ? i18n.t("resetPassword.setNew") : i18n.t("resetPassword.checkYourEmail")}
        links={linksBreadcrumb}
        lng={lng}
        titleMiddle={size.width > 767}
      />
      <section className={`container ${styles.section}`}>
        <div className={styles.inner}>
          {page === "forgotPassword" ?
            <>
              <p>{i18n.t("resetPassword.enterEmailBody")}</p>
              <ResetPassword
                classes={classesResetPassword}
                onErrorMsg={(msg: string) => toast.error(msg)}
                onSuccessMsg={() => setPage("checkEmail")}
                loadingComponent={<Loader color="text-light" />}
              />
            </>
            :
            <p>{i18n.t("resetPassword.checkYourEmailDesc")}</p>
          }
        </div>
      </section>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params
}) => {
  const tokenData = await useAuthToken({ req, res, env: process.env }); 
	const token = tokenData.value;
  const { brand } = await useBrandCommon(req, params, token)

  const cookies = parseCookies(req)
  redirectIfAuthenticated(res, cookies, brand, 'account')

  return {
    props: {
      ...brand
    }
  }
}

export default ForgotPassword