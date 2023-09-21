/*library package */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { toast } from 'react-toastify'
import {
  SetNewPassword,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
/* library component */
import { useBrandCommon } from 'lib/useBrand'
import useWindowSize from 'lib/useWindowSize'
/* library component */
import Layout from 'components/Layout/Layout'
import Icon from 'components/Icon/Icon'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Loader from 'components/Loader/Loader'
/* styles */
import styles from 'public/scss/pages/ResetPassword.module.scss'
import stylesPasswordStrength from 'public/scss/components/PasswordStrength.module.scss'

const classesSetNewPassword = {
  containerClassName: styles.container,
  inputContainerClassName: styles.inputContainer,
  inputClassName: styles.input,
  passwordViewButtonClassName: styles.passwordViewButton,
  passwordStrengthBarClassName: stylesPasswordStrength.passwordStrengthBar,
  passwordCriteriaListClassName: stylesPasswordStrength.passwordCriteriaList,
  passwordCriteriaClassName: stylesPasswordStrength.passwordCriteria,
  passwordStrengthLabelClassName: stylesPasswordStrength.passwordStrengthLabel,
  buttonClassName: styles.button,
  errorClassName: styles.error,
}

const ResetPasswordPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const size = useWindowSize()
  const linksBreadcrumb = [`${i18n.t("header.home")}`, i18n.t("resetPassword.setNew")]
  const layoutProps = {
    lngDict, i18n, lng, brand,
    SEO: { title: i18n.t("resetPassword.setNew") }
  }

  return (
    <Layout {...layoutProps}>
      <Breadcrumb
        title={i18n.t("resetPassword.setNew")}
        links={linksBreadcrumb}
        lng={lng}
        titleMiddle={size.width > 767}
      />
      <section className={`container ${styles.section}`}>
        <SetNewPassword
          classes={classesSetNewPassword}
          onErrorMsg={toast.error}
          onSuccessMsg={toast.success}
          passwordViewIcon={<Icon.setNewPassword.passwordViewIcon />}
          passwordHideIcon={<Icon.setNewPassword.passwordHideIcon />}
          passwordFulfilledCriteriaIcon={<Icon.setNewPassword.passwordCriteriaIcon color="#1DB954" size={16} />}
          passwordUnfulfilledCriteriaIcon={<Icon.setNewPassword.passwordCriteriaIcon color="#E5E7EF" size={16} />}
          loadingComponent={<Loader color="text-light" />}
        />
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

  return {
    props: {
      ...brand
    }
  }
}

export default ResetPasswordPage