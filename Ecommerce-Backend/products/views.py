from django_filters.rest_framework import (
    DjangoFilterBackend
)

from rest_framework import viewsets,filters
from rest_framework.permissions import (
    IsAuthenticated
)

from .permissions import IsAdminOrReadOnly

from .models import (
    Category,
    Brand,
    Product,
    VariantOption,
    VariantOptionValue,
    ProductVariant,
    ProductImage,
    ProductQuestion,
    ProductReview,
)

from .serializers import (
    CategorySerializer,
    BrandSerializer,
    ProductSerializer,
    ProductListSerializer,
    VariantOptionSerializer,
    VariantOptionValueSerializer,
    ProductVariantSerializer,
    ProductImageSerializer,
    ProductQuestionSerializer,
    ProductReviewSerializer,
)

from .filters import ProductVariantFilter,ProductFilter
from .pagination import ProductPagination


# =========================================================
# Category
# =========================================================

class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all()

    serializer_class = CategorySerializer

    permission_classes = [
        IsAdminOrReadOnly
    ]

    lookup_field = 'slug'


# =========================================================
# Brand
# =========================================================

class BrandViewSet(viewsets.ModelViewSet):

    queryset = Brand.objects.all()

    serializer_class = BrandSerializer

    permission_classes = [
        IsAdminOrReadOnly
    ]
    
    lookup_field = 'slug'


# =========================================================
# Product
# =========================================================

class ProductViewSet(viewsets.ModelViewSet):

    queryset = Product.objects.all()

    permission_classes = [
        IsAdminOrReadOnly
    ]

    pagination_class = ProductPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = ProductFilter

    search_fields = [
        'name',
        'brand__name',
        'description',
    ]

    ordering_fields = [
        'name',
        'created_at',
    ]

    ordering = [
        '-created_at'
    ]

    lookup_field = 'slug'

    def get_serializer_class(self):

        if self.action == 'list':
            return ProductListSerializer

        return ProductSerializer


# =========================================================
# Variant Option
# =========================================================

class VariantOptionViewSet(
    viewsets.ModelViewSet
):

    queryset = VariantOption.objects.all()

    serializer_class = VariantOptionSerializer

    permission_classes = [
        IsAdminOrReadOnly
    ]


# =========================================================
# Variant Option Value
# =========================================================

class VariantOptionValueViewSet(
    viewsets.ModelViewSet
):

    queryset = VariantOptionValue.objects.all()

    serializer_class = VariantOptionValueSerializer

    permission_classes = [
        IsAdminOrReadOnly
    ]


# =========================================================
# Product Variant
# =========================================================

class ProductVariantViewSet(
    viewsets.ModelViewSet
):

    queryset = ProductVariant.objects.all()

    serializer_class = ProductVariantSerializer

    permission_classes = [
        IsAdminOrReadOnly
    ]

    pagination_class = ProductPagination

    filter_backends = [
        DjangoFilterBackend
    ]

    filterset_class = ProductVariantFilter

    search_fields = [
        'sku',
        'product__name',
    ]

    ordering_fields = [
        'price',
        'stock',
        'created_at',
    ]

    ordering = [
        '-created_at'
    ]


# =========================================================
# Product Image
# =========================================================

class ProductImageViewSet(
    viewsets.ModelViewSet
):

    queryset = ProductImage.objects.all()

    serializer_class = ProductImageSerializer

    permission_classes = [
        IsAdminOrReadOnly
    ]


# =========================================================
# Product Question
# =========================================================

class ProductQuestionViewSet(
    viewsets.ModelViewSet
):

    serializer_class = ProductQuestionSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        return ProductQuestion.objects.all()

    def perform_create(self, serializer):

        serializer.save(
            user=self.request.user
        )


# =========================================================
# Product Review
# =========================================================

class ProductReviewViewSet(
    viewsets.ModelViewSet
):

    serializer_class = ProductReviewSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        return ProductReview.objects.all()

    def perform_create(self, serializer):

        serializer.save(
            user=self.request.user
        )