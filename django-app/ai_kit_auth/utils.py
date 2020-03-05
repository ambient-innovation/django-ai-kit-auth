def feistel_chipher(seq_id):
    """
    Creates a pseudo random, but unique identifier from a number.
    It can be used instead of sequential primary keys in api functions
    to prevent exposing backend details.
    It is its own inverse, so converting back is done by calling it again.

    further reading: https://wiki.postgresql.org/wiki/Pseudo_encrypt
    """
    val = int(seq_id) & 0xFFFFFFFF  # restrict to u32

    if val != int(seq_id):  # Shouldn't come up in praxis
        raise ValueError(
            f"Input out of Range, id is {seq_id}, but must be in [0 .. 2^32)"
        )

    l1 = (val >> 16) & 0xFFFF
    r1 = val & 0xFFFF
    for _ in range(0, 3):
        l2 = r1
        r2 = (
            l1
            ^ int(round((((1366 * r1 + 150889) % 714025) / 714025.0) * 32767))
            & 0xFFFFFFFF
        )
        l1 = l2
        r1 = r2
    return ((r1 & 0xFFFF) << 16) + l1
