// 이진탐색
const binary_search = (item, list) => {
    let low = 0;
    let high = list.length - 1;

    while ( low <= high ) {
        let mid = Math.round(( low + high ) / 2);
        const guess = list[mid];

        if ( guess === item ) {
            return mid;
        } else if ( guess > item ) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    return null;
};

// 선택정렬
const selection_sort = list => {
    for ( let i = 0; i < list.length; i++ ) {
        let min = i;

        for ( let j = i + 1; j < list.length; j++ ) {
            if ( list[min] > list[j] ) {
                min = j;
            }
        }

        if ( i !== min ) {
            let temp = list[i];
            list[i] = list[min];
            list[min] = temp;
        }
    }

    return list;
};
