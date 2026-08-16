import django_filters

from .models import ProductVariant

import django_filters

from .models import Product


class ProductFilter(
    django_filters.FilterSet
):

    category = django_filters.CharFilter(
        field_name='category__slug',
        lookup_expr='exact'
    )

    brand = django_filters.CharFilter(
        field_name='brand__slug',
        lookup_expr='exact'
    )

    is_active = django_filters.BooleanFilter(
        field_name='is_active'
    )

    is_featured = django_filters.BooleanFilter(
        field_name='is_featured'
    )

    class Meta:

        model = Product

        fields = [
            'category',
            'brand',
            'is_active',
            'is_featured',
        ]


class ProductVariantFilter(
    django_filters.FilterSet
):

    min_price = django_filters.NumberFilter(
        field_name='price',
        lookup_expr='gte'
    )

    max_price = django_filters.NumberFilter(
        field_name='price',
        lookup_expr='lte'
    )

    in_stock = django_filters.BooleanFilter(
        method='filter_in_stock'
    )

    # -----------------------------------------
    # Filter by option value
    # Example:
    # ?option=2
    #
    # 2 could mean "256 GB"
    # -----------------------------------------

    

    def filter_in_stock(
        self,
        queryset,
        name,
        value
    ):

        if value:

            return queryset.filter(
                stock__gt=0
            )

        return queryset.filter(
            stock=0
        )

    option = django_filters.CharFilter(
            method='filter_options'
    )

    def filter_options(
    self,
    queryset,
    name,
    value
    ):

        option_ids = value.split(',')

        for option_id in option_ids:

            queryset = queryset.filter(
                options__id=option_id
            )

        return queryset.distinct()

    class Meta:

        model = ProductVariant

        fields = [
            'product',
            'is_active',
            'min_price',
            'max_price',
            'in_stock',
            'option',
        ]