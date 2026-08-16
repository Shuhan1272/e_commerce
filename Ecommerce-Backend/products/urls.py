from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    BrandViewSet,
    ProductViewSet,
    ProductVariantViewSet,
    VariantOptionViewSet,
    VariantOptionValueViewSet,
    ProductImageViewSet,
    ProductQuestionViewSet,
    ProductReviewViewSet,
)


router = DefaultRouter()


router.register(
    'categories',
    CategoryViewSet,
    basename='category'
)

router.register(
    'brands',
    BrandViewSet,
    basename='brand'
)

router.register(
    'products',
    ProductViewSet,
    basename='product'
)

router.register(
    'variants',
    ProductVariantViewSet,
    basename='product-variant'
)

router.register(
    'variant-options',
    VariantOptionViewSet,
    basename='variant-option'
)

router.register(
    'variant-option-values',
    VariantOptionValueViewSet,
    basename='variant-option-value'
)

router.register(
    'product-images',
    ProductImageViewSet,
    basename='product-image'
)

router.register(
    'questions',
    ProductQuestionViewSet,
    basename='product-question'
)

router.register(
    'reviews',
    ProductReviewViewSet,
    basename='product-review'
)


urlpatterns = router.urls