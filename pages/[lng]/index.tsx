/* library package */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import { 
  useAuthToken, 
  useI18n,
  TemplateFeatures,
  FeaturesType,
  useGetHomepageSection
 } from '@sirclo/nexus'
/* library template */
import { handleGetBanner } from 'lib/client'
import { useBrandCommon } from 'lib/useBrand'
import { GRAPHQL_URI } from 'lib/Constants'
/* component */
import Layout from 'components/Layout/Layout'
import Banner from 'components/Banner'
import MainAdvertisement from 'components/Widget/MainAdvertisement'
import SecondAdvertisement from 'components/Widget/SecondAdvertisement'
import ProductsComponent from 'components/Products/ProductsComponent'
import ProductCategoryComponent from 'components/ProductCategoryComponent/ProductCategoryComponent'
import Instafeed from 'components/Instafeed'

/* styles */
import styles from 'public/scss/components/ProductsComponent.module.scss'

const Home: FC<any> = ({
  lng,
  lngDict,
  dataBanners,
  brand,
  isMenuCategorySectionActive = true,
  isAllProductsSectionActive = false
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n()
  const layoutProps = { 
    lngDict, 
    i18n, 
    lng, 
    brand,  
    SEO: {
      title: i18n.t("home.title")
    }
  }

  console.log({brand: brand}, {banners: dataBanners});

  return (
    <Layout {...layoutProps}>
      <div className="container-fluid p-0">
        <Banner
          i18n={i18n}
          dataBanners={dataBanners}
        />
      </div>

      <TemplateFeatures
        id={FeaturesType.PRODUCT_HIGHLIGHT}
        defaultChildren={
          <>
            <div id="featuredProduct">
              <LazyLoadComponent>
                <ProductsComponent
                  i18n={i18n}
                  lng={lng}
                  type='grid'
                  tagname='featured'
                  withTitle={{
                    type: 'left',
                    title: i18n.t('home.featuredProducts'),
                    withSeeAll: true
                  }}
                />
              </LazyLoadComponent>
            </div>
                
            <section className="container">
              <LazyLoadComponent>
                <MainAdvertisement />
              </LazyLoadComponent>
            </section>
                
            <LazyLoadComponent>
              <ProductsComponent
                i18n={i18n}
                lng={lng}
                type='grid'
                tagname='new-arrivals'
                withTitle={{
                  type: 'left',
                  title: i18n.t('home.arrivalsProducts'),
                  withSeeAll: true
                }}
              />
            </LazyLoadComponent>
          </>
        }
      >
        <section className={styles.products_display1}>        
          <LazyLoadComponent>
            <ProductsComponent
              i18n={i18n}
              lng={lng}
              type='grid'
              ishomepageProductHighlights
              display="Display1"
            />
          </LazyLoadComponent>
        </section>

        <section className="container">
          <LazyLoadComponent>
            <MainAdvertisement />
          </LazyLoadComponent>
        </section>

        <section>
          <LazyLoadComponent>
            <ProductsComponent
              i18n={i18n}
              lng={lng}
              type='grid'
              ishomepageProductHighlights
              display="Display2"
            />
          </LazyLoadComponent>
        </section>
      </TemplateFeatures>

      <section className="container">
        <LazyLoadComponent>
          <SecondAdvertisement />
        </LazyLoadComponent>
      </section>
      
      {isMenuCategorySectionActive && (
        <section className="container">
          <ProductCategoryComponent
            i18n={i18n}
            page='homepage'
            displayMode='normal'
            withTitle
            lng={lng}
            withSeeAll
            itemPerPage={5}
          />
        </section>
      )}
      
      {isAllProductsSectionActive && (
        <LazyLoadComponent>
          <ProductsComponent
            i18n={i18n}
            lng={lng}
            type='grid'
            withTitle={{
              type: 'left',
              title: i18n.t('home.allProducts'),
              withSeeAll: true
            }}
          />
        </LazyLoadComponent>
      )}

      {brand?.socmedSetting?.instagramToken &&
        <section className="container">
          <LazyLoadComponent>
            <Instafeed
              i18n={i18n}
              brand={brand}
              withFollowButton
            />
          </LazyLoadComponent>
        </section>
      }

    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params
}: any) => {
  const tokenData = await useAuthToken({ req, res, env: process.env }); 
	const token = tokenData.value; 
  const [
    brand,
    dataBanners,
    { isAllProductsSectionActive, isMenuCategorySectionActive }
  ] = await Promise.all([
    useBrandCommon(req, params, token),
    handleGetBanner(req, token)
  ])

  const allowedUri: Array<string> = ['en', 'id', 'graphql', 'favicon.ico', "manifest", "sitemap.xml"]

  if (allowedUri.indexOf(params.lng.toString()) == -1) {
    res.writeHead(307, {
      Location: `/${brand.lng}/` + params.lng
    })
    res.end()
  }

  console.log('gssp', token, brand, dataBanners);
  return {
    props: {
      ...brand,
      dataBanners,
      isMenuCategorySectionActive,
      isAllProductsSectionActive
    }
  }
}

export default Home
