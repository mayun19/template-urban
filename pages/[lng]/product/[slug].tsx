/* library package */
import { FC } from 'react'
import { LazyLoadComponent } from 'react-lazy-load-image-component'
import {
  useAuthToken,
  useI18n,
  getProductDetail
} from '@sirclo/nexus'

/* library component */
import { useBrandCommon } from 'lib/useBrand'

/* components */
import SEO from 'components/SEO'
import ProductDetail from 'components/ProductDetail'
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import { GRAPHQL_URI } from 'components/Constants'
import ProductRecomendation from 'components/ProductRecomendation'

const Product: FC<any> = ({
  lng,
  lngDict,
  slug,
  data,
  urlSite,
  brand
}) => {

  const i18n: any = useI18n()
  const layoutProps = {
    lngDict, i18n, lng, brand,
    SEO: {
      title: data?.details[0]?.name,
      description: data?.SEOs[0]?.description,
      keywords: data?.SEOs[0]?.keywords,
      image: data?.imageURLs[0],
    }
  }
  const linksBreadcrumb = [`${i18n.t("header.home")}`, i18n.t("product.shop"), data && data?.details[0]?.name]

  return (
    <Layout {...layoutProps}>
      {data && (
        <SEO
          title={data?.details[0]?.name || ""}
          description={data?.SEOs[0]?.description || ""}
          keywords={data?.SEOs[0]?.keywords?.join(", ") || ""}
          image={data?.imageURLs || ""}
        />
      )}

      {(data?.published || data) && (
        <LazyLoadComponent>
          <Breadcrumb
            links={linksBreadcrumb}
            lng={lng}
            withTitle={false}
          />
        </LazyLoadComponent>
      )}

      <LazyLoadComponent>
        <ProductDetail
          lng={lng}
          data={data}
          i18n={i18n}
          slug={slug}
          brand={brand}
          urlSite={urlSite}
        />
      </LazyLoadComponent>

      <LazyLoadComponent>
        <ProductRecomendation
          type="upsell"
          data={data}
          slug={slug}
          title={i18n.t("product.recomendation")}
        />
      </LazyLoadComponent>
    </Layout>
  );
};

export async function getServerSideProps({
  req,
  res,
  params
}) {
  const { slug } = params

  const tokenData = await useAuthToken({ req, res, env: process.env }); 
	const token = tokenData.value; 
  const [
    { brand },
    data
  ] = await Promise.all([
    useBrandCommon(req, params, token),
    getProductDetail(GRAPHQL_URI(req), slug, token)
  ])
  const urlSite = `https://${req.headers.host}/${params.lng}/product/${slug}`

  return {
    props: {
      ...brand,
      slug,
      data: data || null,
      urlSite,
    }
  }
}

export default Product