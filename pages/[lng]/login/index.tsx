/* library package */
import {
  FC,
  useEffect,
  useRef
} from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import ReCAPTCHA from 'react-google-recaptcha'
import { toast } from 'react-toastify'
import {
  Login,
  useAuthToken,
  useI18n,
  Logo
} from '@sirclo/nexus'
/* library template */
import { parseCookies } from 'lib/parseCookies'
import { useBrandCommon } from 'lib/useBrand'
import { useAuthMethod } from 'lib/client'
import redirectIfAuthenticated from 'lib/redirectIfAuthenticated'
import useWindowSize from 'lib/useWindowSize'
/* component */
import Layout from 'components/Layout/Layout'
import LoginRegisterOTP from 'components/LoginRegisterOTP'
import Icon from 'components/Icon/Icon'
/* styles */
import styles from 'public/scss/pages/Login.module.scss'

const loginClasses = {
  containerClassName: styles.container,
  inputContainerClassName: styles.inputContainer,
  passwordContainerClassName: styles.passwordContainer,
  inputClassName: styles.input,
  passwordInputClassName: styles.passwordInput,
  buttonClassName: styles.button,
  footerClassName: styles.footer,
  forgotPasswordClass: styles.forgotPassword,
  passwordViewButtonClassName: styles.passwordViewButton,
  disclaimerMessageContainerClassName: styles.disclaimer
}

const LoginPage: FC<any> = ({
  lng,
  lngDict,
  brand,
  hasGoogleAuth,
  hasOtp,
  hasFacebookAuth
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const size = useWindowSize()

  const recaptchaRef = useRef<any>()
  const router: any = useRouter()

  useEffect(() => {
    if (!document.body.classList.contains("auth")){
      document.body.classList.add("auth")
    }
  }, [])

  useEffect(() => {
    const removeAuthClassName = () => {
      document.body.classList.remove("auth")
    }

    router.events.on('routeChangeComplete', removeAuthClassName)

    return () => {
      router.events.off('routeChangeComplete', removeAuthClassName)
    }
  }, [])

  const getReCAPTCHAToken = async() => {
    const token = await recaptchaRef.current.executeAsync()
    recaptchaRef.current.reset()
    return token
  }

  const icons = {
    passwordViewIcon: <Icon.register.passwordViewIcon />,
    passwordHideIcon: <Icon.register.passwordHideIcon />,
  }

  const layoutProps = {
    lngDict, 
    i18n, 
    lng, 
    brand,
    SEO: { 
      title: i18n.t("login.login")
    },
    withHeader: false,
    withFooter: false
  }

  return (
    <Layout {...layoutProps}>
      <section className={styles.sectionBrand}>
        <Logo
          imageClassName={styles.brandImage}
          thumborSetting={{
            width: size.width < 575 ? 200 : 400,
            quality: 90
          }}
          lazyLoadedImage={false}
        />
      </section>

      <LoginRegisterOTP
        type="login"
        hasOtp={hasOtp}
        brand={brand}
        title={i18n.t("login.title")}
        hasGoogleAuth={hasGoogleAuth}
        hasFacebookAuth={hasFacebookAuth}
        lng={lng}
        getReCAPTCHAToken={getReCAPTCHAToken}
      >
        <section className={styles.section}>
          <Login
            classes={loginClasses}
            onCompletedMsg={(msg: string) => toast.success(msg)}
            onErrorMsg={(msg: string) => toast.error(msg)}
            loadingComponent={
              <div className="text-center d-flex">
                <span className="spinner-border text-dark" role="status" />
              </div>
            }
            {...icons}
          />
        </section>
      </LoginRegisterOTP>

      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_SITEKEY_RECAPTCHA_INVISIBLE}
        size='invisible'
      />
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
  const [
    { brand },
    { hasGoogleAuth, hasFacebookAuth, hasOtp }
  ] = await Promise.all([
    useBrandCommon(req, params, token),
    useAuthMethod(req, token),
  ])

  const cookies = parseCookies(req)
  redirectIfAuthenticated(res, cookies, brand, 'account')

  return {
    props: {
      ...brand,
      hasGoogleAuth,
      hasFacebookAuth,
      hasOtp
    }
  }
}

export default LoginPage