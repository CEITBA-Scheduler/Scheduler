/**
 * Quicksort, sorting algorithm for a collection of objects
 * @param array       Sorting target array
 * @param left        Starting index
 * @param right       Ending index
 * @param get         Callable function to get the ordering weight
 * @param condition   Callable function to know how to order things
 */
export function quicksort(
    array: Array<any>,
    left: number,
    right: number,
    get = (element) => element,
    condition = (current, pivot) => current > pivot) {

    function swap(list: Array<any>, one: number, two: number): void {
        const auxiliar = list[one];
        list[one] = array[two];
        list[two] = auxiliar;
    }

    function partition(list: Array<any>, leftIndex: number, rightIndex: number, pivot: number): number {
        let partitionIndex = pivot;
        const pivotValue = get(list[pivot]);
        for (let i = leftIndex ; i <= rightIndex ; i++) {
            const currentValue = get(list[i]);
            if ( condition(currentValue, pivotValue) ) {
                while (partitionIndex > i) {
                    partitionIndex -= 1;
                    const swapingValue = get(list[partitionIndex]);
                    if ( !condition(swapingValue, pivotValue) ) {
                        swap(list, i, partitionIndex);
                        break;
                    }
                }

                if (partitionIndex <= i) {
                    swap(list, pivot, partitionIndex);
                    break;
                }
            }
        }

        return partitionIndex;
    }

    const interval: Array<Array<number>> = [[left, right]];
    do {
      const iterInterval = interval.shift();
      const iterLeft = iterInterval[0];
      const iterRight = iterInterval[1];

      if (iterLeft < iterRight) {
          // Choose a pivot value and creates both partitions of the array, ordering with the given condition
          const partitionIndex = partition(array, iterLeft, iterRight, iterRight);

          // Swaps the partition and the pivot values
          interval.push([iterLeft, partitionIndex - 1]);
          interval.push([partitionIndex + 1, iterRight]);
      }
    } while (interval.length > 0);

    return array;
  }
